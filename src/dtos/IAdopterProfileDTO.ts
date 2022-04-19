export default interface IAdopterProfileDTO {
  userId: string;
  street?: string;
  streetNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  extra?: string;
  phone?: string;
}
