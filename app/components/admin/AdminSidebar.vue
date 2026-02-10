<template>
    <aside class="w-64 bg-white border-r flex flex-col h-screen">

        <!-- LOGO -->
        <div class="p-6 font-bold text-lg text-emerald-700">
            MediFinder
        </div>

        <!-- MENU -->
        <nav class="flex-1 px-3 space-y-1">

            <NuxtLink to="/admin"
                class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-slate-100"
                active-class="bg-emerald-50 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6z" />
                </svg>

                <span>Dashboard</span>
            </NuxtLink>


            <NuxtLink to="/admin/apotek"
                class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-slate-100 transition"
                active-class="bg-emerald-50 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" viewBox="0 0 64 64">
                    <path fill="currentColor"
                        d="M56.277 20.663a7.294 7.294 0 1 1-14.588 0a7.294 7.294 0 0 1 14.588 0M3.292 6.261V19.49H1.314a.677.677 0 0 1-.679-.678V1.742c0-.578.431-1.048 1.022-1.048h8.747c.59 0 1.022.469 1.022 1.046v1.002h13.523c.378 0 .68.303.68.676v3.838H14.085V6.251c0-.577-.432-1.046-1.024-1.046H4.317c-.592 0-1.024.477-1.024 1.056z" />
                    <path fill="currentColor"
                        d="M30.946 27.5a.676.676 0 0 1-.68.676H6.631a.676.676 0 0 1-.679-.677v-17.07c0-.578.431-1.048 1.022-1.048h8.745c.592 0 1.024.469 1.024 1.046v1.002h13.523c.377 0 .68.303.68.676zm-10.484-9.719v-4.026h-4.028v4.026h-4.027v4.028h4.027v4.027h4.028v-4.027h4.027v-4.028zM56.19 29.836a7.31 7.31 0 0 1 7.317 7.31l.015 26.733H38.978V41.718h-.994l-4.526 6.753c-.737 1.005-2.233 1.492-3.426 1.492H19.406a3.197 3.197 0 0 1-3.198-3.193c0-1.76 1.433-3.15 3.198-3.15h9.665l6.705-10.138c1.606-2.452 4.748-3.637 7.277-3.637l13.136-.008z" />
                </svg>

                <span>Admin Apotek</span>
            </NuxtLink>


            <NuxtLink to="/admin/daftar-apotek"
                class="block px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-slate-100"
                active-class="bg-emerald-50 text-emerald-700">
                Daftar Apotek
            </NuxtLink>

            <NuxtLink to="/admin/artikel"
                class="block px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-slate-100"
                active-class="bg-emerald-50 text-emerald-700">
                Artikel
            </NuxtLink>

            <NuxtLink to="/admin/kontak" class="block px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-slate-100"
                active-class="bg-emerald-50 text-emerald-700">
                Kontak
            </NuxtLink>

        </nav>

        <!-- LOGOUT -->
        <div class="p-4">
            <button class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition">
                Keluar
            </button>
        </div>

    </aside>
</template>

