<template>
    <div class="flex h-screen overflow-hidden bg-[#f4fbf8] text-slate-800">
        <AdminSidebar />

        <div class="relative flex h-screen flex-1 flex-col overflow-hidden">
            <div
                class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,118,110,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(13,148,136,0.1),_transparent_30%)]" />

            <AdminNavbar class="relative shrink-0" />

            <main class="relative flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
                <slot />
            </main>
        </div>
    </div>
</template>
