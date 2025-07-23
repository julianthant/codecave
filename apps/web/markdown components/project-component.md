const Option3Card = ({ id, title, author, views, hearts, forks }: {
id: string; title: string; author: string; views: string; hearts: string; forks: string;
}) => (
<div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border">
<div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 relative">
<img
          src="https://cdn.builder.io/api/v1/image/assets%2F77225edf03f54b819fde61854f1874b8%2F546268f0c2eb48af9d8944fcc269667f?format=webp&width=800"
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Top corner actions */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => toggleBookmark(id)}
            className={cn(
              "p-1.5 rounded-md backdrop-blur-sm transition-all duration-200 text-xs",
              bookmarks.has(id)
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white/80 text-gray-600 hover:bg-white hover:shadow-sm"
            )}
          >
            <Bookmark className={cn("w-3.5 h-3.5", bookmarks.has(id) && "fill-current")} />
          </button>
          <button
            onClick={() => toggleFavorite(id)}
            className={cn(
              "p-1.5 rounded-md backdrop-blur-sm transition-all duration-200 text-xs",
              favorites.has(id)
                ? "bg-red-500 text-white shadow-md"
                : "bg-white/80 text-gray-600 hover:bg-white hover:shadow-sm"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", favorites.has(id) && "fill-current")} />
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1 text-sm">{title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
              alt={author}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="font-medium text-gray-700">{author}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {hearts}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              {forks}
            </span>
          </div>
        </div>
      </div>
    </div>

);
