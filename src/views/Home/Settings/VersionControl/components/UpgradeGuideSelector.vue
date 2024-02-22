<template>
  <v-select
    :items="items"
    v-bind="$attrs"
    v-on="$listeners"
    outlined
    required
    label="Upgrade Guide"
  ></v-select>
</template>
<script>
export default {
  name: 'UpgradeGuideSelector',
  data() {
    return {
      items: ['recommended', 'required'],
    }
  },
}
</script>
