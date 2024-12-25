<template lang='pug'>
  v-container.pa-0(fluid, grid-list-lg)
    v-layout(row, wrap)
      v-flex(xs12, md4)
        v-text-field(
          outlined
          type='text'
          v-model='order'
          :rules='[rules.required, rules.uintRule]'
          :key='orderKey'
          :label='$t(`editor:props.order`)'
          persistent-hint
          :hint='$t(`editor:props.orderHint`)'
          @keydown='setCursorPosition'
          ref='orderField'
          class='text-right'
          )
</template>

<script>
export default {
  name: 'EditorModalPropertiesOrder',
  data() {
    return {
      order: this.$store.get('page/order'),
      orderKey: 0,
      cursorPosition: 0,
      rules: {
        required: value => !!value || 'This field is required.',
        uintRule: value => {
          const regex = /^(0|[1-9]\d*)$/
          return regex.test(value) || 'Please enter a non-negative integer.'
        }
      }
    }
  },
  watch: {
    order(newValue) {
      const regex = /^(|0|[1-9]\d*)$/
      if (!regex.test(newValue)) {
        const cleanedValue = newValue.replace(/[^\d]/g, '').replace(/^0+/, '')
        this.order = cleanedValue
        this.setOrder(this.order)
        this.orderKey += 1
        this.$nextTick(() => {
          if (this.order === '') {
            this.$refs.orderField.validate(true)
          }
          const newCursorPosition = Math.min(this.cursorPosition, cleanedValue.length);
          const inputElement = this.$refs.orderField.$el.querySelector('input')
          inputElement.focus()
          inputElement.setSelectionRange(newCursorPosition, newCursorPosition)
        })
      } else {
        this.setOrder(newValue)
      }
    }
  },
  created() {
    console.log("'editor-modal-properties-order.vue' component loaded")
  },
  methods: {
    setCursorPosition(event) {
      this.cursorPosition = event.target.selectionStart;
    },
    setOrder(newValue) {
      if (newValue === '') {
        newValue = null
      } else {
        newValue = parseInt(newValue, 10)
      }
      this.$store.set('page/order', newValue)
    }
  }
}
</script>

<style lang='scss'>

.text-right input {
  text-align: right;
}

</style>
