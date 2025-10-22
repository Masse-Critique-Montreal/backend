import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksButtons extends Struct.ComponentSchema {
  collectionName: 'components_blocks_buttons';
  info: {
    displayName: 'Buttons';
    icon: 'bold';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'inputs.button', true>;
    style: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'accent', 'background']
    >;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'Hero';
    icon: 'crown';
  };
  attributes: {
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface BlocksImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_images';
  info: {
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files'>;
  };
}

export interface BlocksNote extends Struct.ComponentSchema {
  collectionName: 'components_blocks_notes';
  info: {
    displayName: 'Note';
    icon: 'lightbulb';
  };
  attributes: {
    shapes: Schema.Attribute.Component<'cosmetic.shape', true>;
    style: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'accent', 'background', 'dark']
    >;
    text: Schema.Attribute.Blocks;
  };
}

export interface BlocksPoliticalParty extends Struct.ComponentSchema {
  collectionName: 'components_blocks_political_parties';
  info: {
    displayName: 'PoliticalParty';
    icon: 'television';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    headline: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    imageAlignment: Schema.Attribute.Enumeration<['top', 'bottom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'top'>;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 0;
        },
        number
      >;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'accent', 'dark', 'white']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'white'>;
  };
}

export interface BlocksText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_texts';
  info: {
    displayName: 'Text';
    icon: 'italic';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    style: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'accent', 'dark', 'white']
    >;
  };
}

export interface CosmeticShape extends Struct.ComponentSchema {
  collectionName: 'components_cosmetic_shapes';
  info: {
    displayName: 'Shape';
    icon: 'star';
  };
  attributes: {
    position: Schema.Attribute.Enumeration<
      ['top-right', 'top-left', 'bottom-right', 'bottom-left']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'top-left'>;
    size: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0.1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    style: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'accent', 'dark']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'secondary'>;
    type: Schema.Attribute.Enumeration<['circle', 'triangle']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'circle'>;
  };
}

export interface InputsButton extends Struct.ComponentSchema {
  collectionName: 'components_inputs_buttons';
  info: {
    displayName: 'Button';
    icon: 'bold';
  };
  attributes: {
    calendar_link: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      [
        'default',
        'defaultGreen',
        'defaultBlue',
        'black',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface SeoMeta extends Struct.ComponentSchema {
  collectionName: 'components_seo_metas';
  info: {
    displayName: 'meta';
    icon: 'code';
  };
  attributes: {
    description: Schema.Attribute.Text;
    images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    keywords: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.buttons': BlocksButtons;
      'blocks.hero': BlocksHero;
      'blocks.image': BlocksImage;
      'blocks.note': BlocksNote;
      'blocks.political-party': BlocksPoliticalParty;
      'blocks.text': BlocksText;
      'cosmetic.shape': CosmeticShape;
      'inputs.button': InputsButton;
      'seo.meta': SeoMeta;
    }
  }
}
