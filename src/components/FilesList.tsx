/* eslint-disable @typescript-eslint/no-explicit-any */


import { Grip, RotateCcw, Share2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BASE_URL } from '../../constants';
import { useUniversalState } from '../context/stateProvider';
import { Button } from './Button';

interface FileMeta {
	views: number;
	order: number;
	userId: string;
	tag: string;
	url: string;
	id: string;
}


export function UploadedFilesList() {
	const { setIsLoggedIn, setUser, setRefetchFilesList, refetchFilesList } = useUniversalState();
	const [orgFiles, setOrgFiles] = useState([]);
	const [files, setFiles] = useState([]);

	useEffect(() => {
		(async () => {
			const res = await fetchData();
			setOrgFiles(res);
			setFiles(res);
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetchFilesList])

	const navigate = useNavigate()

	const fetchData = async () => {
		const userId = JSON.parse(localStorage.getItem('data')?.toString() || "{}")?.id || ""
		try {
			const response = await fetch(`${BASE_URL}/file/files/${userId}`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json()

			if (!response.ok) {
				toast.error(data?.msg)
				localStorage.clear();
				setIsLoggedIn(false);
				setUser(undefined)
				navigate("/login")
				throw new Error('Network response was not ok');
			}

			setFiles(data);
			setRefetchFilesList(false)
			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	};

	const handleDragStart = useCallback((e: any, index: number) => {
		e.dataTransfer.setData("dragIndex", index);
	}, []);

	const handleDragOver = useCallback((e: any) => {
		e.preventDefault(); // Allow drop by preventing the default behavior.
	}, []);

	const handleDrop = (e: any, dropIndex: number) => {
		e.preventDefault();
		const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);

		if (dragIndex === dropIndex) return;

		const updatedFiles = [...files];
		const [draggedFile] = updatedFiles.splice(dragIndex, 1);
		updatedFiles.splice(dropIndex, 0, draggedFile)

		setFiles(updatedFiles?.map((item: FileMeta, index) => ({ ...item, order: index })) as any);
	};

	const saveOrder = async () => {
		try {
			const response = await fetch(`${BASE_URL}/file/changeOrder`, {
				method: "PUT",
				body: JSON.stringify({
					orderData: files?.map((item: FileMeta) => ({ order: item.order, id: item.id }))
				}),
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json()

			if (!response.ok) {
				toast.error(data?.msg)
				throw new Error('Network response was not ok');
			} else {
				toast.success("Order changed successfully!")
			}

			setRefetchFilesList(true)
			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	return (
		<>
			{files?.length > 0 &&
				<div className="container p-6">
					<div className="flex justify-between w-full items-center">
						<h1 className="text-xl font-bold font-comfortaa w-full text-start pl-2 text-gray-700">Uploaded Files</h1>
						{JSON.stringify(files) !== JSON.stringify(orgFiles) && <div className='flex'>
							<Button onClick={() => saveOrder()}>Save Order</Button>
							<Button title="reset" onClick={() => setFiles(orgFiles)}><RotateCcw /></Button>
						</div>}
					</div>
					<div className="w-full space-y-2 overflow-auto max-h-[calc(100vh_-_31rem)] hide-scrollbar">

						{files?.map((file: FileMeta, index: number) => (
							<div
								onDragStart={(e) => handleDragStart(e, index)}
								onDragOver={handleDragOver}
								onDrop={(e) => handleDrop(e, index)}
								key={file?.url + (Math.random() * 100020)?.toString()} className="flex bg-gray-50/25 border shadow-sm h-full items-center w-full rounded-md p-2" draggable={files?.length > 0}>
								{files?.length > 0 && <Grip height={20} width={20} className="mr-2" />}
								{/* {file?.order} */}
								<div className="flex-1">
									<div className="flex space-x-2" title="Share">{file?.url?.split("/")[file?.url?.split("/")?.length - 1]}
									</div>
									{file?.tag && <div className="text-xs">Tag: <b>{file?.tag}</b></div>}
									<div className="text-xs">Viewed {file?.views} times </div>
								</div>
								<div className='flex space-x-2 h-full items-center'>
									<span title="Share">
										<Share2 onClick={() => {
											navigator.clipboard.writeText(`${BASE_URL}/file/${file?.id}`)
											toast.success("Link copied to clipboard!")
										}} height={20} width={20} className='cursor-pointer ml-2' />
									</span>
									{/* <span title="Open in new tab">
										<ExternalLink onClick={() => {
											(window.open(`${BASE_URL}/file/${file?.id}`))
											setTimeout(() => {
												setRefetchFilesList(true)
											}, 1000);
											toast.success("File opened in new window!")
										}} height={20} width={20} className='cursor-pointer' />
									</span>
									<a
										title="download"
										onClick={(e) => {
											e.preventDefault();
											const downloadUrl = `${BASE_URL}/file/${file?.id}`;
											window.open(downloadUrl, '_blank'); // Open the file in a new window
											setTimeout(() => {
												setRefetchFilesList(true)
											}, 1000);
										}}
									>
										<Download
											height={20}
											width={20}
											className="cursor-pointer"
										/>
									</a> */}
								</div>
							</div>
						))}
					</div>
				</div>}
		</>
	)
}

