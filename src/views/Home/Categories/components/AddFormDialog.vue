<template>
  <v-dialog v-model="showForm" width="50%" class="mb-auto">
    <!-- <v-dialog
      v-model="dialog"
      persistent
      width="1024"
    > -->
    <v-card>
      <v-card-title>
        <span class="text-h5">Category</span>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AddCategoryDialog',

  props: {
    showForm: {
      required: true,
      type: Boolean,
    },
  },

  data() {
    return {}
  },

  emits: ['createCategory', 'closeDiaglog'],

  methods: {
    closeDialog() {
      // clear form
      // clear error
      // emit close event
      this.$emit('closeDialog')
    },
  },
}
</script>
