const express = require('express')

const Posts = require('../data/db.js')

const router = express.Router()

// ````````````GET```````````````
// get posts
router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(posts => {
            console.log(posts)
            res.status(200).json({ query: req.query, data: posts })
        })
        .catch(err => {
            console.log(err)
            // cancel request?
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

// get specific post by id
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            console.log(post)
            // console.log(post[0].id)
            if (!post[0]) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

// get all comments by post id
router.get('/:id/comments', (req, res) => {

Posts.findById(req.params.id)
.then(post => {
    console.log(post)
    if(!post[0]){
       res.status(404).json({message:"Post with that id does not exist"}) 
    }else{
        Posts.findPostComments(req.params.id)
        .then(comments => {
            // console.log(comments)
            if (!comments[0]) {
                res.status(404).json({ message: "This post has no comments" })
            } else {
                res.status(200).json(comments)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
    }
})
.catch(err=>{
    console.log(err)
})
  
})

// `````````POST````````````
// post new post
router.post('/', (req, res) => {
    Posts.insert(req.body)
        .then(postid => {
            console.log(postid)
            Posts.findById(postid.id)
                .then(newPost => {
                    res.status(201).json(newPost)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
            if (!req.body.title || !req.body.contents) {
                // cancel request??????
                return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
            } else {
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            }
        })
})


// post new comment to a specific post
router.post('/:id/comments', (req, res) => {
    const info = { ...req.body, post_id: req.params.id }
    Posts.insertComment(info)
        .then(commentid => {
            console.log(commentid)
            Posts.findCommentById(commentid.id)
                .then(comment => {
                    res.status(201).json(comment)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
            Posts.findById(req.params.id)
                .then(post => {
                    console.log(post)
                    if (!post[0]) {
                        res.status(404).json({ message: "The post with the specified ID does not exist." })
                    } else if (!req.body.text) {
                        res.status(400).json({ errorMessage: "Please provide text for the comment." })
                    } else {
                        res.status(500).json({ error: "There was an error while saving the comment to the database" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })

        })
})

//``````````DELETE``````````````
// delete post by id
router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
        .then(totalDeleted => {
            console.log(totalDeleted)
            if (totalDeleted > 0) {
                res.status(200).json({ message: `post with ID ${req.params.id} successfully deleted` })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post could not be removed" })
        })
})

// ````````PUT```````````
// update post by id
router.put('/:id', (req, res) => {

    if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    Posts.update(req.params.id, req.body)
        .then(totalUpdated => {
            console.log(totalUpdated)
           
                Posts.findById(req.params.id)
                .then(updatedPost => {
                    if(totalUpdated > 0 ){
                        res.status(200).json(updatedPost)
                    }else{
                        res.status(404).json({message: "The post with the specified ID does not exist."})
                    }            
                })
                .catch(err => {
                    console.log(err)

                })      
        })
        .catch(err => {
            console.log(err)
                res.status(500).json({ error: "The post information could not be modified."})
        })
})


module.exports = router //don't forget to export; doesn't have to be at the end of everything

// Post:
// {
//     title: "The post title", // String, required
//     contents: "The post contents", // String, required
//     created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
//     updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
//   }

//Comment:
// {
//     text: "The text of the comment", // String, required
//     post_id: "The id of the associated post", // Integer, required, must match the id of a post entry in the database
//     created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
//     updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
//   }