import React, { Component } from 'react'
import Menu from "./menu";
import Footer from "./footer";
import Pumpkin from "../img/dove";
import { view } from "react-easy-state";

import Head from 'next/head';

class Register extends Component {
	state = { username: '', password: '', email: '' };

	handleSubmit = (form) => {
		console.log("form submitted");
		console.log(form);
		const registrationObject = Object.assign({}, { username: this.state.username, password: this.state.password, email: this.state.email });
		const encodedObject = encodeURIComponent(registrationObject);
	}

	handleChangeUsername = (event) => {
		this.setState({ username: event.target.value });
	}

	handleChangePassword = (event) => {
		this.setState({ password: event.target.value });
	}

	handleChangeEmail = (event) => {
		this.setState({ email: event.target.value });
	}

	sendFormToAPI_reg(datastring) {
		let dest = "/register/2/" + datastring.toString();
		console.log("fetch request: (POST) " + dest);
		fetch(dest, { method: "post" })
			.then(function (response) {
				if (response.ok) {
					console.log("response ok");

					return response.json();
				} else {
					throw new Error(response.Error);
				}
			})
			.then(function (myReturn) {
				console.log(myReturn);
			});
	}

	render() {
		return (
			<div id="registerParrots">
				<Menu />
				<h3>Create a new account or <a href="/login">login</a></h3>
				<aside id="termslink">
					By signing up you agree to the site <a href="/terms">terms</a> & <a href="/privacy">privacy policy</a>.
				</aside>

				<div id="parrotsRegisterForm">
					<form id="registerForm" action="/register" method="post">
						<h2>Register for the Site</h2>
						<div>
							<label>Username:</label>
							<input
								value={this.state.username}
								onChange={this.handleChangeUsername}
								name="username"
								type="string"
								placeholder="user name"
								required
							/>
						</div>
						<div>
							<label>Password:</label>
							<input
								value={this.state.password}
								onChange={this.handleChangePassword}
								name="password"
								type="password"
								placeholder="password"
								required
							/>
						</div>
						<div>
							<label>Email:</label>
							<input
								value={this.state.email}
								onChange={this.handleChangeEmail}
								name="email"
								type="email"
								placeholder="email"
								required
							/>
						</div>
						<div>
							<input type="submit" value="Submit" />
						</div>
					</form>
				</div>
				{/* <Pumpkin /> */}
				<section id="logo">
					<img src="alta-redwood-logo" src="./img/Untitled-11.webp" />
				</section>
				<Footer />
				<Head>
					<title>
						{process.env.NEXT_PUBLIC_WEBSITE_NAME} Store - register
					</title>
				</Head>
				<style>{`
				:root {
					--uiFonts: "Ubuntu Mono", "Inconsolata", "Anonymous Pro", "Hack", Menlo,
						monospace;
					--serifFonts: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
					--contentFonts: "Lato", "Open Sans", "Lucida Grande", "Ubuntu Sans",
						"Segoe UI", "Roboto", Helvetica, sans-serif;
					--displayFonts: "Gentona", "Baufra", Helvetica, sans-serif;
					--monoFonts: "Anonymous Pro", "Hack", "Fira Sans", "Inconsolata",
						monospace;
					--textFonts: "Calluna", "Caslon", "Garamond" serif;
					--courierFonts: 'Courier New', Courier, monospace;
				}
				html {
					box-sizing: border-box;
				}
				div#parrotsRegisterForm {
					font-family: var(--courierFonts, monospace);
					background: LightCyan;
				}
				div#registerParrots {
					margin-left: calc(1vw + 5pt);
				}
				@media (max-width: 800px) {
					div#parrotsRegisterForm input {
						width: calc(12pt + 33vw);
						height: calc(6pt + 5vh);
						font-size: calc(1.1rem);
						margin-bottom: calc(3pt + 1vh);
					}
				}
				@media (min-width: 801px) {
					div#parrotsRegisterForm input {
						width: calc(12pt + 8vw);
						height: calc(6pt + 3vh);
						font-size: calc(1.25rem);
						margin-bottom: calc(3pt + 0.5vh);
					}
				}
			`}</style>
			</div>
		)
	}

}

export default view(Register);
