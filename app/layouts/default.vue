<template>
    <div class="min-h-screen bg-gradient-to-r from-blue-900 to-blue-400 font-poppins ">

        <div class="flex flex-col flex-1">
            <!-- Navbar -->
            <Navbar />

            <!-- Konten Halaman -->
            <main>
                <slot />
            </main>

            <!-- <footer class="text-center py-4 text-xs text-gray-500">
                © 2025
            </footer> -->
        </div>

    </div>
</template>
