import { useState } from "react";
import { comments as initialComments } from "./comment-utils";
import CommentItem from "./comment";

function addReplyToComment(comments, parentId, newComment) {
  return comments.map((comment) => {
    // Found the parent
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...comment.replies, newComment]
      };
    }

    // Search inside nested replies
    if (comment.replies?.length > 0) {
      return {
        ...comment,
        replies: addReplyToComment(
          comment.replies,
          parentId,
          newComment
        )
      };
    }

    return comment;
  });
}
function updateLikeCount(comments, commentId, likeCount) {
  return comments.map((comment) => {
    // Found the comment
    if (comment.id === commentId) {
      return {
        ...comment,
        likes: likeCount,
      };
    }

    // Search inside nested replies
    if (comment.replies?.length > 0) {
      return {
        ...comment,
        replies: updateLikeCount(
          comment.replies,
          commentId,
          likeCount
        ),
      };
    }

    return comment;
  });
}
function CommentThread() {
  const [comments, setComments] = useState(initialComments);

  const addReply = (parentId, content) => {
    const newComment = {
      id: Date.now(),
      user: {
        id: 999,
        name: "You"
      },
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      parentId,
      replies: []
    };

    setComments((currentComments) =>
      addReplyToComment(currentComments, parentId, newComment)
    );
  };
const addLike = (commentId, likeCount) => {
  setComments((currentComments) =>
    updateLikeCount(
      currentComments,
      commentId,
      likeCount
    )
  );
};
  return (
    <div className="comment-thread">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={addReply}
          onLike={addLike}
        />
      ))}
    </div>
  );
}

export default CommentThread;