export default (pictureId: string): string => {
  useRuntimeConfig().public.imageUrl
  return useRuntimeConfig().public.imageUrl + "/recipe/picture/" + pictureId
}
