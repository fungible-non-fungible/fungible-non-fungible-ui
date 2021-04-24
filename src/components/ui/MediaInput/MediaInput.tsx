import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';

import { Button } from '@components/ui/Button';

import s from './MediaInput.module.sass';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type MediaInputProps = Omit<InputProps, 'value' | 'type' | 'onChange'> & {
  value?: File
  onChange: (file?: File) => void
};
enum MediaType {
  Unknown,
  Video,
  Image,
}
type MediaPreviewInfo = {
  type: MediaType
  url: string
};

export const MediaInput: React.FC<MediaInputProps> = ({
  value,
  onChange,
  className,
  ...inputProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaPreviewInfo, setMediaPreviewInfo] = useState<MediaPreviewInfo>();

  useEffect(
    () => {
      if (value) {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          ({ target }) => {
            const previewUrl = target?.result;
            if (typeof previewUrl === 'string') {
              let type: MediaType;
              if (value.type.startsWith('image/')) {
                type = MediaType.Image;
              } else if (value.type.startsWith('video/')) {
                type = MediaType.Video;
              } else {
                type = MediaType.Unknown;
              }

              setMediaPreviewInfo({
                type,
                url: previewUrl,
              });
            } else {
              throw new Error('Received non string result from file reader');
            }
          },
        );
        reader.readAsDataURL(value);
      } else {
        setMediaPreviewInfo(undefined);
      }
    },
    [value],
  );

  const onInputChange: InputProps['onChange'] = ({ target }) => onChange(
    target.files?.length ? target.files[0] : undefined,
  );

  return (
    <div className={cx(s.root, className)}>
      {
        mediaPreviewInfo?.type === MediaType.Image
          && (
          <img
            className={s.imagePreview}
            src={mediaPreviewInfo.url}
            alt="..."
          />
          )
      }
      {
        mediaPreviewInfo?.type === MediaType.Video
          && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video className={s.videoPreview} controls>
            <source src={mediaPreviewInfo.url} />
          </video>
          )
      }

      <div className={s.label}>
        <Button onClick={() => inputRef.current?.click()}>Choose file</Button>
        <input
          ref={inputRef}
          className={s.input}
          type="file"
          onChange={onInputChange}
          accept="image/*,video/*"
          {...inputProps}
        />
      </div>
    </div>
  );
};
