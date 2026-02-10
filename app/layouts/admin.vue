<template>
    <div class="flex min-h-screen bg-[#0f766e]">

        <AdminSidebar />

        <div class="flex-1 flex flex-col">
            <AdminNavbar />

            <!-- CONTENT AREA -->
            <main class="flex-1 p-6">
                <slot />
            </main>
        </div>

    </div>
</template>
