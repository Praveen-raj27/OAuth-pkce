import { useEffect, useState } from "react";
import "./comment.css";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

function CommentItem({ comment, onReply, onLike, depth = 0 }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showLikedIcon, setShowLikedIcon] = useState(false);

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText.trim());
    setReplyText("");
    setShowReply(false);
  };

  const handleLike = () => {
    const newLikedState = !showLikedIcon;
    setShowLikedIcon(newLikedState);
    const newLikeCount = newLikedState ? comment.likes + 1 : comment.likes - 1;
    onLike(comment.id, newLikeCount);
  };

  return (
    <div className="comment-wrapper">
      <div className="comment-content">
        <div className="avatar">
          {comment.user.name.charAt(0).toUpperCase()}
        </div>

        <div className="comment-body">
          <div className="comment-header">
            <strong>{comment.user.name}</strong>
            <span>·</span>
            <span>{comment.createdAt}</span>
          </div>

          <div className="comment-text">{comment.content}</div>

          <div className="comment-actions">
            <button>▲</button>

            <span>{comment.likes}</span>

            <button>▼</button>

            <button onClick={() => setShowReply((value) => !value)}>
              ↩ Reply
            </button>
            <button onClick={() => handleLike()}>
              {!showLikedIcon ? <ThumbUpOffAltIcon /> : <ThumbUpAltIcon />}
            </button>
          </div>

          {/* Reply input */}

          {showReply && (
            <div className="reply-box">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="What are your thoughts?"
                autoFocus
              />

              <div>
                <button
                  onClick={() => {
                    setReplyText("");
                    setShowReply(false);
                  }}
                >
                  Cancel
                </button>

                <button onClick={handleReply}>Reply</button>
              </div>
            </div>
          )}

          {/* Nested comments */}

          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
