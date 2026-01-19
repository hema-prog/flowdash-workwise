import { Upload, FileText, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { X, Download } from "lucide-react";

const mockDocuments = [
  {
    id: 1,
    task: "Homepage UI Development",
    name: "UI_Wireframe.pdf",
    status: "Approved",
    uploadedOn: "16 Jan 2026",
    type: "pdf",
    url: null,
    risk: "safe",
    timeline: [
      { label: "Uploaded", date: "16 Jan 2026" },
      { label: "Reviewed", date: "17 Jan 2026" },
      { label: "Approved", date: "18 Jan 2026" },
    ],
    reviews: [
    {
      author: "Manager",
      message: "UI looks clean. Approved for implementation.",
      date: "18 Jan 2026",
    },
  ],
  },
  {
    id: 2,
    task: "API Integration",
    name: "Screenshot.png",
    status: "Uploaded",
    uploadedOn: "17 Jan 2026",
    type: "image",
    url: "https://via.placeholder.com/600",
    risk: "needs-review",
    timeline: [
      { label: "Uploaded", date: "17 Jan 2026" },
    ],
reviews: [
  {
    author: "Manager",
    message: "Please upload final version with fixes.",
    date: "17 Jan 2026",
  },
],
  },
  {
    id: 3,
    task: "Bug Fixing",
    name: "Logs.zip",
    status: "Pending Review",
    uploadedOn: "—",
    type: "other",
    url: "#",
    risk: "overdue",
    timeline: [
      { label: "Uploaded", date: "18 Jan 2026" },
      { label: "Pending Review", date: "—" },
    ],
    reviews: [
  {
    author: "Manager",
    message: "Please upload final version with fixes.",
    date: "17 Jan 2026",
  },
],
  },
];

const styles = `
  @keyframes card-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.2); }
    50% { box-shadow: 0 0 35px rgba(168, 85, 247, 0.35); }
  }
  
  .glass-card {
    animation: card-glow 3s ease-in-out infinite;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(168, 85, 247, 0.2);
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 27, 75, 0.5));
  }
`;

if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default function OperatorDocuments() {
    const [previewDoc, setPreviewDoc] = useState<null | {
  name: string;
  type: "pdf" | "image" | "other";
  url?: string;
  risk: "overdue" | "needs-review" | "safe";
  timeline: { label: string; date: string }[];
  reviews: {
    author: string;
    message: string;
    date: string;
  }[];
}>(null);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Documents</h1>
        <p className="text-purple-200/70">
          Upload and manage task-related documents
        </p>
      </div>

      {/* DOCUMENT TABLE */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-purple-950/50 text-purple-200">
            <tr>
              <th className="text-left p-4">Task</th>
              <th className="text-left p-4">Document</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Risk</th>
              <th className="text-left p-4">Uploaded On</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-purple-500/20">
            {mockDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-purple-500/10 transition-colors">
                <td className="p-4 font-medium text-white">
                  {doc.task}
                </td>

                <td className="p-4 flex items-center gap-2 text-purple-200">
                  <FileText size={16} className="text-purple-400" />
                  {doc.name}
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                      doc.status === "Approved"
                        ? "bg-green-950/40 text-green-300 border border-green-500/30"
                        : doc.status === "Pending Review"
                        ? "bg-orange-950/40 text-orange-300 border border-orange-500/30"
                        : "bg-blue-950/40 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {doc.status === "Approved" && <CheckCircle2 size={12} />}
                    {doc.status === "Pending Review" && <Clock size={12} />}
                    {doc.status === "Uploaded" && <Upload size={12} />}
                    {doc.status}
                  </span>
                </td>
<td className="p-4">
  <span
    className={`px-3 py-1 text-xs font-semibold rounded-full ${
      doc.risk === "overdue"
        ? "bg-red-950/40 text-red-300 border border-red-500/30"
        : doc.risk === "needs-review"
        ? "bg-orange-950/40 text-orange-300 border border-orange-500/30"
        : "bg-green-950/40 text-green-300 border border-green-500/30"
    }`}
  >
    {doc.risk === "overdue" && "⚠ Overdue"}
    {doc.risk === "needs-review" && "⏳ Needs Review"}
    {doc.risk === "safe" && "✔ Safe"}
  </span>
</td>

                <td className="p-4 text-purple-200/70">
                  {doc.uploadedOn}
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() =>
                      setPreviewDoc({
                        name: doc.name,
                        type: doc.type as "pdf" | "image" | "other",
                        url: doc.url,
                        risk: doc.risk as "overdue" | "needs-review" | "safe",
                        timeline: doc.timeline,
                        reviews: doc.reviews,
                      })
                    }
                    className="text-purple-400 hover:text-pink-400 underline text-sm font-medium transition-colors"
                  >
                    Upload / View
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center ">
          <div className="glass-card rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col relative">

      
            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-purple-500/20">
              <h3 className="font-semibold text-white">
                {previewDoc.name}
              </h3>
              <button onClick={() => setPreviewDoc(null)} className="text-purple-300 hover:text-pink-400 transition-colors">
                <X />
              </button>
            </div>

            {/* BODY */}
            <div className="p-4 flex-1 overflow-y-auto bg-slate-900/50">
              {previewDoc.type === "pdf" && (
          
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <FileText size={48} className="text-purple-400" />
                  <p className="font-medium text-white">PDF Preview (Mock)</p>
                  <p className="text-sm text-purple-200/70">
                    This is a demo preview. Actual file will be available after backend integration.
                  </p>
                </div>
              )}
              {previewDoc && previewDoc.risk === "overdue" && (
                <div className="bg-red-950/40 border border-red-500/30 text-red-300 px-4 py-2 text-sm rounded-lg">
                  ⚠ This document is overdue and requires immediate attention.
                </div>
              )}

              {previewDoc && previewDoc.risk === "needs-review" && (
                <div className="bg-orange-950/40 border border-orange-500/30 text-orange-300 px-4 py-2 text-sm rounded-lg">
                  ⏳ This document is awaiting review.
                </div>
              )}

              {previewDoc.type === "image" && (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <img
                    src="https://via.placeholder.com/400x250?text=Image+Preview"
                    className="rounded-lg shadow"
                  />
                  <p className="text-sm text-purple-200/70">Mock image preview</p>
                </div>
              )}


              {previewDoc.type === "other" && (
                <div className="text-center space-y-4">
                  <p className="text-purple-200">
                    Preview not available for this file type
                  </p>
                  <button
                    className="inline-flex items-center gap-2 bg-purple-600/50 text-purple-200 px-4 py-2 rounded-lg cursor-not-allowed opacity-80"
                  >
                    <Download size={16} /> Download (Disabled)
                  </button>

                </div>
              )}
            </div>
            {/* DOCUMENT TIMELINE */}
            <div className="border-t border-purple-500/20 px-5 py-4 bg-slate-900/30">
              <h4 className="text-sm font-semibold text-purple-300 mb-3">
                Document Timeline
              </h4>

              <div className="space-y-2">
                {previewDoc.timeline.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm text-purple-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="font-medium">{step.label}</span>
                    <span className="text-xs text-purple-400">{step.date}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* REVIEW COMMENTS */}
            <div className="border-t border-purple-500/20 px-5 py-4 bg-slate-900/50">
              <h4 className="text-sm font-semibold text-purple-300 mb-3">
                Review Comments
              </h4>

              {previewDoc.reviews.length > 0 ? (
                <div className="space-y-3">
                  {previewDoc.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/60 border border-purple-500/20 rounded-lg p-3 text-sm"
                    >
                      <p className="text-purple-200 mb-1">
                        {review.message}
                      </p>
                      <div className="text-xs text-purple-400">
                        — {review.author} • {review.date}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-purple-300 italic">
                  No review comments yet.
                </p>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
