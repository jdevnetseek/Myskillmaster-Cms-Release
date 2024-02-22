<template>
  <v-dialog :value="value" @input="$emit('input')" max-width="290">
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <strong>{{ message }}</strong>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <slot>
          <v-btn text @click="$emit('cancel')">Cancel</v-btn>
          <v-btn color="primary" text @click="$emit('confirm')">Confirm</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
}
</script>

<style></style>
