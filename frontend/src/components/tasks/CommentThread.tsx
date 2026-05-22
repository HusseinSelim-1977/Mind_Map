import { useState } from "react";
import { Avatar } from "../ui/Misc";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";
import { cn } from "../../lib/utils";

interface Comment {
  id: string;
  user: { name: string; avatar?: string };
  text: string;
  createdAt: string;
}

export function CommentThread({ comments: initialComments }: { comments: Comment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: { name: "Current User" },
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col gap-16">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-12">
            <Avatar fallback={comment.user.name} src={comment.user.avatar} className="h-32 w-32" />
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-8">
                <span className="text-sm font-semibold text-slate-900">{comment.user.name}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px]"
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm">Post Comment</Button>
        </div>
      </form>
    </div>
  );
}
