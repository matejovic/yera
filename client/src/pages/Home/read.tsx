import { useState, useEffect } from 'preact/hooks';
import './style.css';


const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api';

export function Read(props) {

	const [bookmarkData, setBookmarkData] = useState(null);

useEffect(() => {
	loadBookmark(props.id);
}, []);

const loadBookmark = async (id) => {
	const response = await fetch(API_URL + `/bookmark/${id}`);
	const data = await response.json();
	setBookmarkData(data);
}

	return (
		<div class="home">


					{bookmarkData ? (
							<div class="reader">
									<h2>{bookmarkData.title}</h2>
									<div dangerouslySetInnerHTML={{ __html: bookmarkData.content_html}}></div>
							</div>
					) : (
							<p>Loading...</p>
					)}

		</div>
	);
}

