import Menu from "./menu";
//	import Keyboard from "../img/keyboard";
import { view } from "react-easy-state";

import Footer from "./footer";
import Head from 'next/head';

import Eagle from "../img/eagle";
import { Component } from "react";

function createMarkup() {
	return {
		__html: `<form id="loginForm" action="/login" method="post">
	<div>
		<label>Username:</label>
		<input type="text" name="username" required /><br/>
	</div>
	<div>
		<label>Password:</label>
		<input type="password" name="password" required />
	</div>
	<div>
		<input type="submit" value="Submit"/>
	</div>
</form>`};
};

class Login extends Component {
	state = { username: '', password: '' };

	handleSubmit = (form) => {
		console.log("form submitted");
		console.log(form);
		const loginObject = Object.assign({}, { username: this.state.username, password: this.state.password });
		const encodedObject = encodeURIComponent(loginObject);
		//	this.sendFormToAPI_reg(encodedObject);
	}

	handleChangeUsername = (event) => {
		this.setState({ username: event.target.value });
	}

	handleChangePassword = (event) => {
		this.setState({ password: event.target.value });
	}

	sendFormToAPI_login(datastring) {
		let dest = "/login";
		console.log("fetch request: (POST) " + dest);
		fetch(dest, { method: "post", body: datastring})
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
			<div id="loginParrots">
				<Menu id="theMneu" />
				<h4 className="parrotHeader">Log In To Your Account or <a href="/register">Register</a></h4>
				{/* <div id="parrotsLoginForm" dangerouslySetInnerHTML={createMarkup()} /> */}
				<div id="parrotsLoginForm">
					<form id="loginForm" action="/login" method="post">
						<h2>Log In to the Site</h2>
						<div>
							<label>Username:</label>
							<input
								value={this.state.username}
								onChange={this.handleChangeUsername}
								name="username"
								type="string"
								
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
							<input type="submit" value="Submit" />
						</div>
					</form>
				</div>
				<Eagle />
				<Footer />
				<Head>
					<title>
						Alta Redwood Store - login
        </title>
				</Head>
				<style>
					{`
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
				div#parrotsLoginForm, #theMenu {
					font-family: var(--courierFonts, monospace);
					background: LavenderBlush;
					margin-left: calc(1vw + 5pt);
				}
				div#parrotsLoginForm input {
					width: calc(12pt + 8vw);
					height: calc(6pt + 3vh);
					font-size: calc(1.2rem);
				}
				div#loginParrots {
					margin-left: calc(1vw + 5pt);
				}
				#parrotHeader {
					font-family: var(--serifFonts, serif);
				}
				@media (max-width: 800px) {
					div#loginParrots input {
						width: calc(12pt + 33vw);
						height: calc(6pt + 5vh);
						font-size: calc(1.1rem);
						margin-bottom: calc(3pt + 1vh);
					}
				}
				@media (min-width: 801px) {
					div#loginParrots input {
						width: calc(12pt + 8vw);
						height: calc(6pt + 3vh);
						font-size: calc(1.25rem);
						margin-bottom: calc(3pt + 0.5vh);
					}
				}
				`}
				</style>
			</div>
		)
	}
};

export default view(Login);
