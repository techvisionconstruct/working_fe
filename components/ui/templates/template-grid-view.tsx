import { useMemo } from "react";
import Image from "next/image";
import { templates } from "@/data/templates";
import { Card, CardContent, Badge } from "@/components/shared";
import Link from "next/link";
import { TemplateGridProps } from "@/types/templates";


export default function TemplateGridView({ sortOption, searchQuery = "" }: TemplateGridProps) {

  const filteredAndSortedTemplates = useMemo(() => {
    const filtered = searchQuery
      ? templates.filter(template => 
          template.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : templates;
    
    return [...filtered].sort((a, b) => {
      if (sortOption.value === "name-ascending") {
        return a.title.localeCompare(b.title);
      } else if (sortOption.value === "name-descending") {
        return b.title.localeCompare(a.title);
      } else if (sortOption.value === "date-ascending") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortOption.value === "date-descending") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return 0;
    });
  }, [sortOption, searchQuery]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {filteredAndSortedTemplates.length > 0 ? (
        filteredAndSortedTemplates.map((template) => (
          <Card
            key={template.id}
            className="h-full rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="w-full h-44 relative -mt-20">
              <Image
                src={template.imageUrl || "/placeholder.svg"}
                alt={template.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent>
              <h1 className="text-xl font-bold">{template.title}</h1>
              <p className="mt-1 text-sm text-black/50 line-clamp-3">
                {template.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-wrap gap-2 max-w-full">
                  {template.categories.slice(0, 4).map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="font-bold uppercase text-xs"
                    >
                      {category.name}
                    </Badge>
                  ))}
                  {template.categories.length > 4 && (
                    <Badge
                      variant="outline"
                      className="font-bold uppercase text-xs"
                    >
                      +{template.categories.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <span className="uppercase font-bold">Variables</span>
                  <span className="ml-1 h-4 w-4 rounded-sm bg-black/50 text-xs text-primary-foreground flex items-center justify-center">
                    {template.variables?.length || 0}
                  </span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <span className="uppercase font-bold">Categories</span>
                  <span className="ml-1 h-4 w-4 rounded-sm bg-black/50 text-xs text-primary-foreground flex items-center justify-center">
                    {template.categories?.length || 0}
                  </span>
                </Badge>
              </div>

              <div className="flex justify-between items-center mt-4 ml-1">
                <p className="text-sm font-bold">{template.created_at}</p>
                <Link href={`templates/${template.id}`} className="text-sm font-bold hover:underline">
                  Read More
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-3 py-8 text-center">
          <p className="text-lg font-medium">No templates found matching your search.</p>
        </div>
      )}
    </div>
  );
}
