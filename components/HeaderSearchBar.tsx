"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeaderSearchBarProps {
  mobile?: boolean
}

export function HeaderSearchBar({ mobile }: HeaderSearchBarProps) {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={mobile ? "relative" : "relative w-full"}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-darker w-4 h-4" />
      <Input
        placeholder="Search materials..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={mobile ? "pl-10 pr-4 py-2" : "pl-10 pr-4 py-2 border-accent/20 focus:border-accent"}
      />
    </form>
  );
}