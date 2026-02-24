<template>
    <div class="min-h-screen">
        <NuxtPage />
    </div>
</template>

<script setup>
useHead({
    script: [
        {
            src: 'https://accounts.google.com/gsi/client',
            async: true,
            defer: true
        }
    ]
})
</script>