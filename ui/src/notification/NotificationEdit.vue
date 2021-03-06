<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Notification</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row
            cols="30"
            sm="6"
            md="4"
          >
            <v-select
              v-model="editedNotification.type"
              :items="notificationTypes"
              label="Type"
            />
          </v-row>
          <v-row
            cols="20"
            sm="6"
            md="4"
          >
            <v-text-field
              v-model="editedNotification.condition"
              label="Condition"
            />
          </v-row>
          <v-row
            cols="10"
            sm="6"
            md="4"
          >
            <webhook-edit
              v-if="editedNotification.type === 'webhook'"
              v-model="editedNotification"
              style="flex: 1 1 auto"
              @validityChanged="validForm = $event"
            />
            <firebase-edit
              v-if="editedNotification.type === 'fcm'"
              v-model="editedNotification"
              style="flex: 1 1 auto"
              @validityChanged="validForm = $event"
            />
            <slack-edit
              v-if="editedNotification.type === 'slack'"
              v-model="editedNotification"
              style="flex: 1 1 auto"
              @validityChanged="validForm = $event"
            />
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="!validForm"
          @click="onSave()"
        >
          Save
        </v-btn>
        <v-btn
          color="error"
          class="ma-2"
          @click="closeDialog()"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import NotificationConfig, { WebhookNotification, CONFIG_TYPE } from '@/notification/notificationConfig'
import NotificationEditDialog from '@/notification/notificationEditDialog.vue'
import { Emit } from 'vue-property-decorator'

import WebhookEdit from '@/notification/WebhookEdit.vue'
import FirebaseEdit from '@/notification/FirebaseEdit.vue'
import SlackEdit from '@/notification/SlackEdit.vue'

@Component({
  components: { SlackEdit, WebhookEdit, FirebaseEdit }
})
export default class NotificationEdit extends Vue implements NotificationEditDialog {
  private validForm = false;

  @Emit('save')
  onPipelineSave (): NotificationConfig {
    return this.editedNotification
  }

  private dialogOpen = false

  private notificationTypes = Object.values(CONFIG_TYPE) // Convert CONFIG_TYPES to list

  private defaultNotification: WebhookNotification = {
    id: -1,
    pipelineId: -1,
    condition: 'true',
    url: '',
    type: CONFIG_TYPE.WEBHOOK
  }

  private editedNotification: NotificationConfig = Object.assign({}, this.defaultNotification)

  openDialog (notificationConfig?: NotificationConfig): void {
    if (notificationConfig) { // edit
      this.editedNotification = Object.assign({}, notificationConfig)
    } else { // create
      this.editedNotification = Object.assign({}, this.defaultNotification)
    }
    this.dialogOpen = true
  }

  closeDialog (): void {
    this.editedNotification = Object.assign({}, this.defaultNotification)
    this.dialogOpen = false
  }

  onSave (): void {
    this.onPipelineSave()
    this.closeDialog()
  }
}

</script>
