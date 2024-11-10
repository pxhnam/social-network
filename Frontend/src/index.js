import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import AuthProvider from './context/AuthProvider';
import ChatProvider from './context/ChatProvider';
import App from './App';
import reportWebVitals from './reportWebVitals';

axios.defaults.baseURL = 'http://127.0.0.1:3000/api';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>
	// </React.StrictMode>
	<AuthProvider>
		<ChatProvider>
			<App />
		</ChatProvider>
	</AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
