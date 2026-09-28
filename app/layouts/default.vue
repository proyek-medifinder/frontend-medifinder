<template>
    <div
        class="overflow-x-hidden min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        <Navbar />
        <main class="flex-1">
            <slot />
        </main>
        <Footer />
        <ChatBot />
    </div>
</template>

<script setup>
// Layout global default
</script>
