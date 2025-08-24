import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import React from 'react'

const ModalDetail = () => {

    const [progress, setProgress] = React.useState(0);
    const [showProgressInput, setShowProgressInput] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [progressInput, setProgressInput] = React.useState("");
    // Data dummy untuk riwayat aduan dapur terhadap atasan maupun pemasok bahan
    const dummyHistory = [
        {
            chat: 'Dapur melaporkan keterlambatan pengiriman bahan dari pemasok.',
            summary: 'Aduan terkait keterlambatan bahan baku.',
            created_at: '2024-06-10'
        },
        {
            chat: 'Dapur meminta penambahan stok bahan ke atasan.',
            summary: 'Permintaan penambahan stok.',
            created_at: '2024-06-11'
        },
        {
            chat: 'Dapur mengeluhkan kualitas bahan dari pemasok.',
            summary: 'Aduan kualitas bahan.',
            created_at: '2024-06-12'
        }
    ]
    // Dummy comments
    const [comments, setComments] = React.useState([
        {
            user: "Budi",
            comment: "Terima kasih atas update progressnya!",
            date: "2024-06-13"
        },
        {
            user: "Siti",
            comment: "Mohon dicek kembali kualitas bahan.",
            date: "2024-06-14"
        },
        {
            user: "Andi",
            comment: "Pengiriman berikutnya diharapkan lebih cepat.",
            date: "2024-06-15"
        }
    ]);

    const [newComment, setNewComment] = React.useState("");
    const handleAddComment = () => {
        if (!newComment.trim()) return;
        setComments([
            ...comments,
            {
                user: "User", // You can replace with actual user
                comment: newComment,
                date: new Date().toISOString().slice(0, 10)
            }
        ]);
        setNewComment("");
    };

    return (
        <div className='flex flex-col space-y-4'>
            <div className=" flex justify-end space-x-2">
                <Link href="/cctv/kemang-jakarta-selatan">
                    <Button variant="outline" className="text-blue-500 ">
                        CCTV
                    </Button>
                </Link>
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="text-blue-500 ">
                            {progress === 100 ? "Done" : progress > 0 ? "On Progress" : "To Do"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>On Progress</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            setProgress(0);
                            setShowProgressInput(false);
                        }}>To Do</DropdownMenuItem>
                        <DropdownMenuItem onClick={e => {
                            e.preventDefault();
                            setShowProgressInput(true);
                            setDropdownOpen(true);
                        }}>On Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            setProgress(100);
                            setShowProgressInput(false);
                        }}>Done</DropdownMenuItem>
                        {showProgressInput && (
                            <div className="p-2">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={progressInput}
                                    onChange={e => setProgressInput(e.target.value)}
                                    className="border rounded px-2 py-1 w-20 text-sm mr-2"
                                    placeholder="%"
                                />
                                <Button variant="outline" size="sm" onClick={() => {
                                    const val = Math.max(0, Math.min(100, Number(progressInput)));
                                    setProgress(val);
                                    setShowProgressInput(false);
                                    setProgressInput("");
                                    setDropdownOpen(false);
                                }}>
                                    Set
                                </Button>
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <table className="min-w-full border border-gray-200 rounded">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border-b text-left">No</th>
                        <th className="px-4 py-2 border-b text-left">Chat</th>
                        <th className="px-4 py-2 border-b text-left">Summary</th>
                        <th className="px-4 py-2 border-b text-left">Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyHistory.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">{idx + 1}</td>
                            <td><span title={item.chat}>
                                {item.chat.length > 50 ? item.chat.slice(0, 50) + '...' : item.chat}
                            </span></td>
                            <td><span title={item.summary}>
                                {item.summary.length > 50 ? item.summary.slice(0, 50) + '...' : item.summary}
                            </span></td>
                            <td className="px-4 py-2 border-b">{item.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Progress value={progress} className='bg-blue-100' />
            {/* Comment Section */}
            <div className="mt-2">
                <div className="font-semibold mb-2">Comments</div>
                <div className="max-h-32 overflow-y-auto border rounded bg-gray-50 p-2 space-y-2">
                    {comments.map((c, idx) => (
                        <div key={idx} className="p-2 bg-white rounded shadow-sm">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{c.user}</span>
                                <span>{c.date}</span>
                            </div>
                            <div className="text-sm text-gray-700">{c.comment}</div>
                        </div>
                    ))}
                </div>
                {/* Input and Button for adding comment */}
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        className="flex-1 border rounded px-2 py-1 text-sm"
                        placeholder="Tambah komentar..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                    />
                    <Button variant="default" onClick={handleAddComment}>
                        Kirim
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ModalDetail