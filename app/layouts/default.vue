<template>
    <div class="min-h-screen font-poppins ">

        <div class="flex flex-col flex-1">
            <!-- Navbar -->
            <Navbar />

            <!-- Konten Halaman -->
            <main>
                <slot />
            </main>

            <!-- Footer -->
            <Footer />
        </div>

    </div>
</template>
