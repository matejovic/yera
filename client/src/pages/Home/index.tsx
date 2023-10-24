import { useState } from 'preact/hooks';
import './style.css';
import Modal from '../../components/Modal';

export function Home() {

	const [showModal, setShowModal] = useState(false);
	const [bookmarkData, setBookmarkData] = useState(null);

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (event.key === "Enter") {
				const url = event.target.value;
				const response = await fetch("http://localhost:8000/bookmark", {
						method: "POST",
						headers: {
								"Content-Type": "application/json"
						},
						body: JSON.stringify({ url })
				});
				const data = await response.json();
				setBookmarkData(data.data);
				console.log(data);
				setShowModal(true);
		}
};

const handleCloseModal = () => {
		setShowModal(false);
		setBookmarkData(null);
};

	return (
		<div class="home">

			<div className="newUrl">
				<input type="text" placeholder="https://" onKeyDown={handleKeyDown} />
			</div>
			<section class="reading-list">
				<Resource
					title="Learn about geopolitics"
					href="/read/geopolitics"
				/>
				<Resource
					title="Complicated nature of reality"
					href="/read/reality"
				/>
				<Resource
					title="Science of having fun"
					href="/read/fun"
				/>
			</section>
			{/* <Modal>
				<p>Modal content</p>
			</Modal> */}
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
		<a href={props.href} target="_blank" class="read-item">
			<div className="read-item__left">
				<h2>{props.title}</h2>
				<span>Financial Times</span>
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
