import { HydrateClient } from "@/trpc/server";
import { redirect, RedirectType } from "next/navigation";
import { auth } from "@/server/auth";
import { SidebarLeft } from "@/components/sidebar-left";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Chat from "./_components/chat";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login", RedirectType.replace);
    return null;
  }

  return (
    <HydrateClient>
      <SidebarProvider>
        <SidebarLeft session={session} />
        <SidebarInset>
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                      New Chat
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <Chat />
        </SidebarInset>
      </SidebarProvider>
    </HydrateClient>
  );
}
