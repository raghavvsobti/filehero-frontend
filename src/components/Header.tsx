import { useLocation, useNavigate } from "react-router-dom"
import { useUniversalState } from "../context/stateProvider";
import { useEffect, useMemo } from "react";
import { BASE_URL } from "../../constants";
import AnimatedGradientText from "./AnimatedGradientText";

const Header = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const isLoginPage = useMemo(() => pathname === "/login", [pathname]);
	const { isLoggedIn, setIsLoggedIn, setUser, user } = useUniversalState();

	const logout = async () => {
		await fetch(`${BASE_URL}/auth/logout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
			},
			credentials: "include",
		}).then((response) =>
			response
				.json()
				.then(() => {
					localStorage.clear();
					setIsLoggedIn(false);
					setUser(undefined);
					navigate("/login");
				})
				.catch((error) => {
					console.error("Error: ", error);
				})
		);
	};

	useEffect(() => {
		const data = localStorage.getItem("data");
		if (user === null && data) {
			setUser(JSON.parse(data))
		}
	}, [setUser, user])

	return (
		<>
			{!isLoginPage && (
				<div className="md:px-36 mr-10 w-full">
					<div className="w-full">
						<div className="flex justify-between w-full">
							<span onClick={() => navigate("/")} className="w-fit">
								<AnimatedGradientText>FileHero</AnimatedGradientText>
							</span>

							<div>
								<button className="text-gray-800 mr-2 hover:bg-gray-100 transition-all ease-in duration-100 bg-white px-4 py-1 font-semibold rounded-md my-2" onClick={() => !isLoggedIn ? navigate("/login") : logout()}>{isLoggedIn ? "Sign out" : "Sign in"}
								</button>
							</div>

						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Header