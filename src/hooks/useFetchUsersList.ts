import { useEffect, useState } from "react";
import { BASE_URL } from "../../constants";
import { Options } from "../interface";

export const useFetchUsersList = () => { 
	const [userOptions, setUserOptions] = useState<Options[]>([]);

	useEffect(() => {
		(async () => {
		  const response = await fetch(`${BASE_URL}/api/users`, {
			headers: {
			  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
			},
		  });
	
		  const data = await response.json();
		  setUserOptions(data?.map((item: Options & {name: string}) => ({ label: item?.name, value: item?.id, id: item?.id })));
		})()
	  }, [])
	
	return userOptions
}