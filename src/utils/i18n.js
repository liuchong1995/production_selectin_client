// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title, path = '') {
  if (path !== '') {
    let splits = path.split('/')
    if (/^[0-9]+$/.test(splits[splits.length - 1])) {//这是用正则表达是检查
      title += ` - ${splits[splits.length - 1]}`
    }
  }
  /*const hasKey = this.$te('route.' + title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t('route.' + title)

    return translatedTitle
  }*/
  return title
}
