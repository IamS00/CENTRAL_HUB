// Placeholder for resource card component
// Will be implemented in Phase 3

interface ResourceCardProps {
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'link';
  thumbnailUrl?: string;
  tags?: string[];
}

export default function ResourceCard({
  title,
  description,
  type,
  thumbnailUrl,
  tags = []
}: ResourceCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="bg-gray-100 h-40 rounded mb-4 flex items-center justify-center">
        <span className="text-4xl">
          {type === 'pdf' ? '📄' : type === 'video' ? '🎥' : '🔗'}
        </span>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
      {description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action button */}
      <button className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
        {type === 'pdf' ? 'View PDF' : type === 'video' ? 'Watch Video' : 'Open Link'}
      </button>
    </div>
  );
}
