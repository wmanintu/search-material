<template>
    <div>
        {{ total }}
    </div>
</template>

<script>
export default {
    props: ['A1', 'A2', 'A3', 'A4'],
    computed: {
        total() {
            return this.A1 + this.A2 + this.A3 + this.A4
        }
    }
        
}
</script>

<style lang="scss" scoped>

</style>