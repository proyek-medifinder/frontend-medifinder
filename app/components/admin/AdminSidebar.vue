<template>
    <aside class="w-64 bg-white border-r flex flex-col h-screen">

        <!-- LOGO -->
        <div class="p-6 font-bold text-lg text-emerald-700">
            MediFinder Admin
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


            <NuxtLink to="/admin/adminapotek"
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
                class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-slate-100"
                active-class="bg-emerald-50 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="3">
                        <path stroke-linejoin="round"
                            d="M42.615 14.604c1.957.162 3.395 1.81 3.318 3.773c-.217 5.534-.935 10.047-1.7 13.43c-.82 3.629-3.08 6.474-6.242 7.87c.727.592 1.63 1.56 1.898 2.858c.243 1.18-.88 2.043-2.083 2.12C35.5 44.8 31.071 45 23.998 45c-7.074 0-11.5-.199-13.807-.345c-1.201-.077-2.324-.939-2.082-2.118c.292-1.42 1.346-2.446 2.097-3.016c-3.32-1.613-5.647-4.767-6.485-8.696a78 78 0 0 1-1.638-12.452a3.577 3.577 0 0 1 3.3-3.769C8.7 14.33 14.638 14 24 14s15.3.33 18.616.604Z" />
                        <path
                            d="m24.635 14.001l1.945-8.693c.292-1.305 1.419-2.242 2.745-2.066c.76.1 1.686.27 2.74.553c1.054.282 1.94.599 2.649.891c1.236.51 1.743 1.886 1.344 3.162l-1.973 6.3" />
                        <path stroke-linejoin="round"
                            d="M21.088 36.124c.027.897.57 1.675 1.46 1.79c.393.05.875.086 1.452.086s1.059-.036 1.453-.086c.89-.115 1.432-.893 1.46-1.79c.027-.912.057-2.274.074-4.137c1.863-.017 3.225-.047 4.137-.075c.897-.027 1.675-.57 1.79-1.46c.05-.393.086-.875.086-1.452s-.036-1.059-.086-1.453c-.115-.89-.893-1.432-1.79-1.46a205 205 0 0 0-4.137-.074a201 201 0 0 0-.075-4.137c-.027-.897-.57-1.675-1.46-1.79C25.06 20.036 24.578 20 24 20s-1.059.036-1.453.086c-.89.115-1.432.893-1.46 1.79a205 205 0 0 0-.074 4.137c-1.863.017-3.225.047-4.137.075c-.897.027-1.675.57-1.79 1.46c-.05.393-.086.875-.086 1.452s.036 1.059.086 1.453c.115.89.893 1.432 1.79 1.46c.912.027 2.274.057 4.137.074c.017 1.863.047 3.225.075 4.137" />
                    </g>
                </svg>
                Daftar Apotek
            </NuxtLink>

            <NuxtLink to="/admin/artikel"
                class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-slate-100 transition"
                active-class="bg-emerald-50 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm2-4h7v-2H7zm0-4h10v-2H7zm0-4h10V7H7z" />
                </svg>
                Artikel
            </NuxtLink>

            <NuxtLink to="/admin/transaksi"
                class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-slate-100 transition"
                active-class="bg-emerald-50 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="1.5">
                        <path
                            d="M4.58 8.607L2 8.454C3.849 3.704 9.158 1 14.333 2.344c5.513 1.433 8.788 6.918 7.314 12.25c-1.219 4.411-5.304 7.337-9.8 7.406" />
                        <path stroke-dasharray=".5 3" d="M12 22C6.5 22 2 17 2 11" />
                        <path
                            d="M13.604 9.722c-.352-.37-1.213-1.237-2.575-.62c-1.361.615-1.577 2.596.482 2.807c.93.095 1.537-.11 2.093.47c.556.582.659 2.198-.761 2.634s-2.341-.284-2.588-.509m1.653-6.484v.79m0 6.337v.873" />
                    </g>
                </svg>
                Riwayat Transaksi
            </NuxtLink>

            <NuxtLink to="/admin/kontak"
                class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-slate-100 transition"
                active-class="bg-emerald-50 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-width="2"
                        d="M1 2h21v16h-8l-8 4v-4H1zm5 8h1v1H6zm5 0h1v1h-1zm5 0h1v1h-1z" />
                </svg>
                Kontak
            </NuxtLink>

        </nav>

        <!-- LOGOUT -->
        <div class="p-4">
            <NuxtLink to="/">
                <button class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition">
                    Keluar
                </button>
            </NuxtLink>
        </div>

    </aside>
</template>
