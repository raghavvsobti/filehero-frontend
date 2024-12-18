/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL } from "../constants";
import { UploadedFilesList } from "./components/FilesList";
import { TagModel } from "./components/TagModal";
import { TypingAnimation } from "./components/TypingAnimation";
import { useUniversalState } from "./context/stateProvider";
import { useFetchUsersList } from "./hooks/useFetchUsersList";

function Home() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showTagModal, setShowTagModal] = useState<boolean>(false);
  const [tag, setTag] = useState<string>("")
  const [file, setFile] = useState<File | null>();

  const { user, setUser, setRefetchFilesList } = useUniversalState();
  const userOptions = useFetchUsersList()

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("data")) {
      navigate("/login")
    }
  }, [])

  useEffect(() => {
    const data = localStorage.getItem("data");
    if (!user && data) {
      setUser(JSON.parse(data))
    }
  }, [user])

  const handleSubmit = async (event?: any) => {
    setShowTagModal(false);
    if (event) {
      event.preventDefault();
    }
    setIsUploading(true);

    if (!file && !event?.target?.files[0]) {
      alert('Please select a file to upload');
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file || event.target.files[0]);
      formData.append('tag', tag);
      console.log(Object.fromEntries(formData));
      const response = await fetch(`${BASE_URL}/file/upload/${user?.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          // "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        const data = await response.json();
        if (data.msg) {
          console.log(data.msg)
          toast.success(data.msg)
        }
        setUser(data?.user);
      }
      setIsUploading(false);
      setRefetchFilesList(true)
      setFile(null)
      fileInputRef.current!.value = "";
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Something went wrong!")
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = ((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("here")
    if (e.target.files) {
      setShowTagModal(true);
      setFile(e.target.files[0]);
    }
  });

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [fileInputRef]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    setIsUploading(true)
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
      setShowTagModal(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => e.preventDefault(), [])

  useEffect(() => {
    if (!showTagModal) {
      setTimeout(() => {
        setFile(null);
        setTag("");
        fileInputRef.current!.value = "";
      }, 1000);
    }
  }, [showTagModal])

  return (
    <div className="flex flex-col w-full h-full pt-24 overflow-clip">
      <div className="w-full flex flex-col justify-center items-center">
        <TypingAnimation text="Upload Files!" />
        <p className="text-center mb-3">Secure document uploading..</p>
      </div>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50/40 transition-colors"
        onClick={handleButtonClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p className="text-sm text-gray-500">
          {file ? `Selected file: ${file.name}` : "Drag and drop a file here, or click to select a file"}
        </p>
        <button
          disabled={isUploading}
          className="mt-4 disabled:cursor-not-allowed inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          type="button"
        >
          {isUploading ? "Uploading..." : "Select & Upload"}
        </button>
        <input
          type="file"
          accept="application/pdf, image/png, image/jpeg, video/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />

      </div>
      <TagModel tag={tag} setTag={setTag} handleSubmit={handleSubmit} isModalOpen={showTagModal} setIsModalOpen={setShowTagModal} usersOptions={userOptions} />
      <UploadedFilesList />
    </div>
  )
}

export default Home