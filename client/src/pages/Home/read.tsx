import { useState, useEffect } from 'preact/hooks';
import './style.css';


const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api';

export function Read(props) {

	const [bookmarkData, setBookmarkData] = useState(null);
  const [tags, setTags] = useState('');
  const [note, setNote] = useState('');

useEffect(() => {
	loadBookmark(props.id);
}, []);

const loadBookmark = async (id) => {
	const response = await fetch(API_URL + `/bookmark/${id}`);
	const data = await response.json();
	setBookmarkData(data);
}

const handleSubmit = async (event) => {
  event.preventDefault();
  // Your submit logic here...
  console.log(`Tags: ${tags}`);
  console.log(`Note: ${note}`);
  // send put request to update bookmark
  const response = await fetch(API_URL + `/bookmark/${props.id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tags: tags.split(',').map(tag => tag.trim()), 
      note
    })
  });
  console.log(response.json());
};

	return (
		<div class="home">


					{bookmarkData ? (
							<div class="reader">
                  <form onSubmit={handleSubmit} style="display: contents">
                    <input 
                      type="text" 
                      placeholder="add comma separated tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)} />
                    <textarea 
                      name="" id="" 
                      placeholder="Add a note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}></textarea>
                    <button>Save</button>
                  </form>


									<h2>{bookmarkData.title}</h2>
									<div dangerouslySetInnerHTML={{ __html: bookmarkData.content_html}}></div>
							</div>
					) : (
							<p>Loading...</p>
					)}

		</div>
	);
}

