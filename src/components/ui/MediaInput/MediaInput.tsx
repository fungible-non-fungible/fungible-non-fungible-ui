import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';

import { Button } from '@components/ui/Button';
import Trash from '@icons/Trash.svg';

import s from './MediaInput.module.sass';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type MediaInputProps = Omit<InputProps, 'value' | 'type' | 'onChange'> & {
  label?: string
  labelClassName?: string
  value?: File
  error?: string
  success?: boolean
  onChange: (file?: File) => void
};
export enum MediaType {
  Unknown,
  Video,
  Image,
}
export type MediaPreviewInfo = {
  type: MediaType
  url: string
};

export const MediaInput: React.FC<MediaInputProps> = ({
  label,
  labelClassName,
  value,
  error,
  success = false,
  onChange,
  className,
  ...inputProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaPreviewInfo, setMediaPreviewInfo] = useState<MediaPreviewInfo>();

  const compoundClassname = cx(
    s.root,
    { [s.errorInput]: !!error },
    { [s.success]: success },
    className,
  );

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

  const onInputChange: InputProps['onChange'] = ({ target }) => {
    onChange(
      target.files?.length ? target.files[0] : undefined,
    );
  };

  return (
    <div className={compoundClassname}>
      {label && (
        <span className={cx(s.labelText, labelClassName)}>{label}</span>
      )}
      <div className={s.label}>
        {
          mediaPreviewInfo?.type
          && (
            <>
              <button
                type="button"
                className={s.trash}
                onClick={() => onChange(undefined)}
              >
                <Trash className={s.trashIcon} />
              </button>
              <div className={s.fileWrapper}>
                {
                mediaPreviewInfo?.type === MediaType.Image
                && (
                  <img
                    className={s.imagePreview}
                    src={mediaPreviewInfo.url}
                    alt="NFT"
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
              </div>
            </>
          )
        }
        {!mediaPreviewInfo?.type && (
          <>
            <p className={s.description}>PNG, GIF, WEBP, MP4 or MP3. Max 30mb.</p>
            <Button
              className={s.button}
              onClick={() => inputRef.current?.click()}
            >
              Choose file
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          className={s.input}
          type="file"
          onChange={onInputChange}
          accept="image/*,video/*"
          {...inputProps}
        />
      </div>
      <div className={s.errorContainer}>
        {error && (
          <div className={cx(s.errorText)}>{error}</div>
        )}
      </div>
    </div>
  );
};
