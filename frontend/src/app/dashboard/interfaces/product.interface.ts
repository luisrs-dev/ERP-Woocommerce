export interface Product {
  id:                    number;
  name:                  string;
  slug:                  string;
  permalink:             string;
  date_created:          Date;
  date_created_gmt:      Date;
  date_modified:         Date;
  date_modified_gmt:     Date;
  type:                  string;
  status:                string;
  featured:              boolean;
  catalog_visibility:    string;
  description:           string;
  short_description:     string;
  sku:                   string;
  price:                 string;
  regular_price:         string;
  sale_price:            string;
  date_on_sale_from:     null;
  date_on_sale_from_gmt: null;
  date_on_sale_to:       null;
  date_on_sale_to_gmt:   null;
  on_sale:               boolean;
  purchasable:           boolean;
  total_sales:           number;
  virtual:               boolean;
  downloadable:          boolean;
  downloads:             any[];
  download_limit:        number;
  download_expiry:       number;
  external_url:          string;
  button_text:           string;
  tax_status:            string;
  tax_class:             string;
  manage_stock:          boolean;
  stock_quantity:        null;
  backorders:            string;
  backorders_allowed:    boolean;
  backordered:           boolean;
  low_stock_amount:      null;
  sold_individually:     boolean;
  weight:                string;
  dimensions:            Dimensions;
  shipping_required:     boolean;
  shipping_taxable:      boolean;
  shipping_class:        string;
  shipping_class_id:     number;
  reviews_allowed:       boolean;
  average_rating:        string;
  rating_count:          number;
  upsell_ids:            any[];
  cross_sell_ids:        any[];
  parent_id:             number;
  purchase_note:         string;
  categories:            Category[];
  tags:                  any[];
  images:                Image[];
  attributes:            any[];
  default_attributes:    any[];
  variations:            any[];
  grouped_products:      any[];
  menu_order:            number;
  price_html:            string;
  related_ids:           number[];
  meta_data:             MetaDatum[];
  stock_status:          string;
  has_options:           boolean;
  post_password:         string;
  global_unique_id:      string;
  yoast_head:            string;
  yoast_head_json:       YoastHeadJSON;
  _links:                Links;
}

export interface Links {
  self:       Self[];
  collection: Collection[];
}

export interface Collection {
  href: string;
}

export interface Self {
  href:        string;
  targetHints: TargetHints;
}

export interface TargetHints {
  allow: string[];
}

export interface Category {
  id:   number;
  name: string;
  slug: string;
}

export interface Dimensions {
  length: string;
  width:  string;
  height: string;
}

export interface Image {
  id:                number;
  date_created:      Date;
  date_created_gmt:  Date;
  date_modified:     Date;
  date_modified_gmt: Date;
  src:               string;
  name:              string;
  alt:               string;
}

export interface MetaDatum {
  id:    number;
  key:   string;
  value: Array<PurpleValue | string> | FluffyValue | string;
}

export interface PurpleValue {
  et_pb_section_9b8e08abf2b6b7e25b5cb504ac3537e4: EtPb;
  et_pb_row_dffd449fe52cd4fbc61c7e943ba35789:     EtPb;
  et_pb_column_bff5cbdcf886a4f6e4ec14a6ad045d8b:  EtPbColumnBff5Cbdcf886A4F6E4Ec14A6Ad045D8B;
  et_pb_text_81465c812e3cbe40c6010e577adf41f7:    EtPbText;
  et_pb_text_6a654d72129eef68d8a9c6619ca7c87d:    EtPbText;
  et_pb_text_dc06cf426e51244225324102e7b7e940:    EtPbText;
  et_pb_text_75ae0088ac3799f6812118645e8f0146:    EtPbText;
  et_pb_text_689f57a9f4dd34ca6ce892c36ebc7e8a:    EtPbText;
  et_pb_image_1f5a469b1cb16210e6582d6657f8ae67:   EtPbImage1F5A469B1Cb16210E6582D6657F8Ae67;
}

export interface EtPbColumnBff5Cbdcf886A4F6E4Ec14A6Ad045D8B {
  bosh: boolean;
  pos:  boolean;
  anim: boolean;
}

export interface EtPbImage1F5A469B1Cb16210E6582D6657F8Ae67 {
  cuma:  boolean;
  mawi:  boolean;
  bosh:  boolean;
  pos:   boolean;
  mapac: boolean;
  anim:  boolean;
}

export interface EtPb {
  mawi: boolean;
  bosh: boolean;
  anim: boolean;
}

export interface EtPbText {
  glde:   Glde;
  foop:   boolean;
  tesh:   boolean;
  mawi:   boolean;
  bosh:   boolean;
  pos:    boolean;
  anim:   boolean;
  cuma?:  boolean;
  mapac?: boolean;
}

export interface Glde {
  text_font_size:        string;
  text_letter_spacing:   string;
  text_line_height:      string;
  header_font_size:      string;
  header_letter_spacing: string;
  header_line_height:    string;
  background_size:       string;
  background_position:   string;
  background_repeat:     string;
  background_blend:      string;
}

export interface FluffyValue {
  "0"?:       string;
  "1"?:       string;
  "2"?:       string;
  "31"?:      string;
  "50"?:      string;
  family?:    Family;
  subset?:    string[];
  cache_key?: string;
}

export interface Family {
  "et-gf-abeezee":      string;
  "et-gf-josefin-sans": string;
  "et-gf-autour-one":   string;
}

export interface YoastHeadJSON {
  title:                 string;
  robots:                Robots;
  canonical:             string;
  og_locale:             string;
  og_type:               string;
  og_title:              string;
  og_description:        string;
  og_url:                string;
  og_site_name:          string;
  article_modified_time: Date;
  twitter_card:          string;
  twitter_misc:          TwitterMisc;
  schema:                Schema;
}

export interface Robots {
  index:               string;
  follow:              string;
  "max-snippet":       string;
  "max-image-preview": string;
  "max-video-preview": string;
}

export interface Schema {
  "@context": string;
  "@graph":   Graph[];
}

export interface Graph {
  "@type":             string;
  "@id":               string;
  url?:                string;
  name?:               string;
  isPartOf?:           Breadcrumb;
  primaryImageOfPage?: Breadcrumb;
  image?:              Breadcrumb;
  thumbnailUrl?:       string;
  datePublished?:      Date;
  dateModified?:       Date;
  breadcrumb?:         Breadcrumb;
  inLanguage?:         string;
  potentialAction?:    PotentialAction[];
  contentUrl?:         string;
  width?:              number;
  height?:             number;
  itemListElement?:    ItemListElement[];
  description?:        string;
}

export interface Breadcrumb {
  "@id": string;
}

export interface ItemListElement {
  "@type":  string;
  position: number;
  name:     string;
  item?:    string;
}

export interface PotentialAction {
  "@type":        string;
  target:         string[] | TargetClass;
  "query-input"?: QueryInput;
}

export interface QueryInput {
  "@type":       string;
  valueRequired: boolean;
  valueName:     string;
}

export interface TargetClass {
  "@type":     string;
  urlTemplate: string;
}

export interface TwitterMisc {
  "Tiempo de lectura": string;
}
