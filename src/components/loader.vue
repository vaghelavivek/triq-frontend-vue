<template>
	<loading :active="active" :can-cancel="false" :is-full-page="true" loader="dots" :lock-scroll="true" color="#0076CE" width="65" height="65" opacity="0.7"/>
</template>

<script>
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/css/index.css';
	export default{
		props:['active'],
		components: {
            Loading
        },
	}
</script>