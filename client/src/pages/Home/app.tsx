import { useState, useEffect } from 'preact/hooks';
import './style.css';
import Modal from '../../components/Modal';


console.log(import.meta.env.MODE);

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api';

export function ReaderApp() {

	const [showModal, setShowModal] = useState(false);
	const [bookmarkData, setBookmarkData] = useState(null);
	const [bookmarks, setBookmarks] = useState([]);

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (event.key === "Enter") {
				const url = event.target.value;
				const response = await fetch(API_URL + "/bookmark", {
						method: "POST",
						credentials: "include",
						headers: {
								"Content-Type": "application/json"
						},
						body: JSON.stringify({ url })
				});
				const data = await response.json();
				// add data.bookmark to bookmarks
				setBookmarks([...bookmarks, data]);
				setBookmarkData(data.bookmark);
				console.log(data);
				setShowModal(true);
		}
};

const handleCloseModal = () => {
		setShowModal(false);
		setBookmarkData(null);
};

useEffect(() => {
	const fetchBookmarks = async () => {
		const response = await fetch(API_URL +"/bookmarks", {
			credentials: 'include'
		});
		const data = await response.json();
		setBookmarks(data);
		console.log('bookmarks were set', bookmarks)
	};
	fetchBookmarks();
}, []);

const handleClick = async (id) => {
	const response = await fetch(API_URL + `/bookmark/${id}`);
	const data = await response.json();
	setBookmarkData(data);
	setShowModal(true);
}

	return (
		<div class="home">

			<div className="newUrl">
				<input type="text" placeholder="https://" onKeyDown={handleKeyDown} />
			</div>
			<section class="reading-list">
				{bookmarks.map((bookmark) => (
					<Resource
						title={bookmark.bookmark.title}
						url={bookmark.bookmark.url}
						clickAction={() => handleClick(bookmark.bookmark.id)}
					/>
				))}
			</section>

			{showModal && (
				<Modal onClose={handleCloseModal}>
					{bookmarkData ? (
							<>
									<h2>{bookmarkData.title}</h2>
									<div dangerouslySetInnerHTML={{ __html: bookmarkData.content_html}}></div>
							</>
					) : (
							<p>Loading...</p>
					)}
		</Modal>
			)}
		</div>
	);
}

function Resource(props) {
	return (
		<a href={props.href} target="_blank" class="read-item" onClick={props.clickAction}>
			<div className="read-item__left">
				<h2>{props.title}</h2>
				<span>{props.url}</span>
			</div>
			<div className="read-item__right">
				<div className="tags">
					<span>#geopolitics</span>
					<span>#politics</span>
				</div>
				<div className="datetime">
					<span>Added: 2021-03-01</span>
				</div>
			</div>
		</a>
	);
}
