import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const initialPosts = []

function App() {
const [posts, setPosts] = useState(initialPosts)

  useEffect(() =>{
  axios.get('http://localhost:8000/api/posts')
  .then(res=>{
    console.log(res)
    setPosts(res.data.data)
  })
  .catch(err=>{
    console.log(err)
  })
  },[])

  return (
    <div className="App">
        {posts.map(post=>{
          return(
            <div className='postCard'>
               <h3>{post.contents}:</h3>
                <p>{post.title}</p>
                <h6>created: {post.created_at}</h6> 
            </div>
          )
        })}
    </div>
  );
}

export default App;
