import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_SNIPPETS } from "@/mockdata";
import { useState } from "react";
import { CiHeart, CiSearch } from "react-icons/ci";
import { FaCode, FaFileCode } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SnippetsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortOption, setSortOption] = useState("recent");
  const [tagFilter, setTagFilter] = useState("all");
  const navigate = useNavigate();

  const allTags = Array.from(
    new Set(MOCK_SNIPPETS.flatMap((snippet) => snippet.tags))
  );

  let filteredSnippets = MOCK_SNIPPETS.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesLanguage =
      languageFilter === "all" ||
      snippet.language.toLowerCase() === languageFilter.toLowerCase();

    const matchesTag = tagFilter === "all" || snippet.tags.includes(tagFilter);

    return matchesSearch && matchesLanguage && matchesTag;
  });

  if (sortOption === "likes") {
    filteredSnippets = [...filteredSnippets].sort((a, b) => b.likes - a.likes);
  } else if (sortOption === "comments") {
    filteredSnippets = [...filteredSnippets].sort(
      (a, b) => b.comments.length - a.comments.length
    );
  } else {
    filteredSnippets = [...filteredSnippets].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const handleViewSnippet = (snippetId: number) => {
    navigate(`/snippets/${snippetId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col  mb-6">
        <h3 className="text-3xl font-bold mb-2">Code Snippets</h3>
        <p className="text-muted-foreground">
          Browse and share useful code snippets with the community
        </p>
      </div>
      {/* Search & Templates */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search Templates..."
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            defaultValue="all"
            onValueChange={(value) => {
              setLanguageFilter(value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Language</SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="C++">C++</SelectItem>
                <SelectItem value="Typescript">Typescript</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
                <SelectItem value="SQL">SQL</SelectItem>
                <SelectItem value="PHP">PHP</SelectItem>
                <SelectItem value="CSS">CSS</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            defaultValue="all"
            onValueChange={(value) => setTagFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue="recent"
            onValueChange={(value) => setSortOption(value)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="likes">Most Liked</SelectItem>
              <SelectItem value="comments">Most Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredSnippets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 ">
          {filteredSnippets.map((snippet) => (
            <Card key={snippet.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle
                      className="text-xl hover:text-primary cursor-pointer"
                      onClick={() => {
                        handleViewSnippet(snippet.id);
                      }}
                    >
                      {snippet.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {snippet.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={snippet.author.avatar}
                        alt={snippet.author.name}
                      />
                      <AvatarFallback>
                        {snippet.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{snippet.language}</Badge>
                  {snippet.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto max-h-40">
                  <code>
                    {snippet.content.split("\n").slice(0, 5).join("\n")}
                    {snippet.content.split("\n").length > 5 ? "..." : ""}
                  </code>
                </pre>
              </CardContent>
              <CardFooter className="border-t flex justify-between">
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center">
                    <CiHeart className="size-4 mr-1 " />
                    <span>{snippet.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <FiMessageSquare className="size-4 mr-1" />
                    <span>{snippet.comments.length}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCode className="size-4 mr-1" />
                    <span>{snippet.language}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleViewSnippet(snippet.id);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaFileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Snippets found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter to find what you're looking for
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SnippetsPage;
