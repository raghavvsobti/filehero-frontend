/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from '@radix-ui/react-dialog'
import React from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './Dialog'
import { Button } from './Button';
import { Options } from '../interface';

type Props = {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	usersOptions: Options[];
	handleSubmit: any;
	setTag: React.Dispatch<React.SetStateAction<string>>;
	tag: string;
}

export const TagModel = ({ isModalOpen, setIsModalOpen, handleSubmit, tag, setTag }: Props) => {
	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogContent className="bg-gray-100 h-lg">
				<DialogHeader>
					<DialogTitle>Add a unique tag!</DialogTitle>
					<DialogDescription>
						You have to add a unique tag to make it stand out easily
					</DialogDescription>

					<div className="py-3">
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="tag"
							type="tag"
							placeholder="Enter tag here.."
							value={tag}
							name="tag"
							onChange={(e) => setTag(e.target.value)}
						/>
					</div>

				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={handleSubmit}>
						Tag
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}