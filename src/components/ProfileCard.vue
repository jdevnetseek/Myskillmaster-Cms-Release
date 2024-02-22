<template>
  <v-card>
    <v-card-title class="primary">
      <v-layout align-center justify-center column class="pt-6 white--text">
        <v-avatar
          class="ma-2 avatar-border--white elevation-10"
          color="secondary"
          size="100"
        >
          <span class="white--text"> {{ profile.avatarText }} </span>
        </v-avatar>
        <div class="display-1 ma-3">{{ profile.full_name }}</div>
      </v-layout>
    </v-card-title>
    <v-tabs
      v-model="activeTab"
      grow
      slider-color="primary"
      background-color="transparent"
    >
      <v-tab href="#details">Details</v-tab>
      <v-tab href="#acl">ACL</v-tab>
      <v-tab href="#logs">Logs</v-tab>
    </v-tabs>
    <v-tabs-items v-model="activeTab">
      <v-tab-item value="details">
        <v-list two-line>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo"> {{ icons.email }} </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ profile.email }} &nbsp;
              </v-list-item-title>
              <v-list-item-subtitle>Email address</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo"> {{ icons.phone }} </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ profile.phone_number }} &nbsp;
              </v-list-item-title>
              <v-list-item-subtitle>Phone number</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo"> {{ icons.date }} </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ profile.addedDate }}</v-list-item-title>
              <v-list-item-subtitle>Date added</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import User from '@/models/User'
import { mdiPhone, mdiEmail, mdiCalendar } from '@mdi/js'

export default {
  props: {
    profile: {
      type: User,
      required: true
    }
  },
  data() {
    return {
      icons: {
        phone: mdiPhone,
        email: mdiEmail,
        date: mdiCalendar
      },
      activeTab: 'details'
    }
  }
}
</script>

<style>
.v-avatar.avatar-border--white.secondary {
  border: 2px solid;
  border-color: white !important;
}
</style>
