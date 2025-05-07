"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="w-full px-1.5 py-5">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md">
            <div className="relative size-5 p-1 rounded-sm bg-white">
              <Image
                src={"/logo.png"}
                fill
                alt="Redditime's Logo"
                className="object-center object-contain"
              />
            </div>
          </div>
          <span className="truncate font-medium text-sm">Redditime</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
