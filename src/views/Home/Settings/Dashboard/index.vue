<template>
  <div>
    <v-row>
      <v-col cols="4" v-for="(item, i) in list" :key="i">
        <v-card>
          <v-card-title>
            <span class="title font-weight-light">{{ item.title }}</span>
          </v-card-title>
          <v-card-subtitle>
            {{ item.subtitle }}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary " :to="item.to" text>
              {{ item.actionTxt }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      list: [
        {
          title: 'Privacy Policy',
          subtitle: 'Update the Privacy Policy.',
          actionTxt: 'Modify',
          to: { name: 'settings.pages.privacy' },
        },
        {
          title: 'Terms of Service',
          subtitle: 'Update the Terms of service.',
          actionTxt: 'Modify',
          to: { name: 'settings.pages.terms-of-service' },
        },
      ],
    }
  },
}
</script>
