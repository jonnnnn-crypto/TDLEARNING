import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalChatPage() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Discussions Hub</h2>
          <p className="text-muted-foreground mb-8">
             Percakapan dan diskusi dilakukan di dalam masing-masing channel Komunitas. Silakan kembali ke komunitas Anda untuk melihat pesan terbaru.
          </p>
          <Button asChild>
             <Link href="/community">Temukan Komunitas</Link>
          </Button>
        </div>
    )
}
