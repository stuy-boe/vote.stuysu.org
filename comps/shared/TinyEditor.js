import { gql, useMutation } from "@apollo/client";
import { Editor } from "@tinymce/tinymce-react";
import { useSnackbar } from "notistack";

const UPLOAD_MUTATION = gql`
  mutation ($file: Upload!, $alt: NonEmptyString!) {
    uploadPicture(alt: $alt, file: $file) {
      id
      alt
      resource {
        url
      }
    }
  }
`;

const TinyEditor = ({ value, setValue, className, disabled }) => {
  const [uploadPicture] = useMutation(UPLOAD_MUTATION);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <div className={className}>
      <Editor
        value={value}
        apiKey={
          process.env.NEXT_APP_TINYMCE_APIKEY ||
          "r4gqpa27clwqn023b14ncg66uf4q3d8dgvisiec7io5jv679"
        }
        init={{
          height: 350,
          menubar: false,
          default_link_target: "_blank",
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "formatselect | bold italic forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | link image media | removeformat",
          automatic_uploads: true,
          browser_spellcheck: true,
          images_upload_handler: (file, success, failure) => {
            uploadPicture({
              variables: {
                file: file.blob(),
                alt: "Upload for platform field",
              },
            })
              .then(({ data }) => success(data?.uploadPicture?.resource?.url))
              .catch(failure);
          },
          images_upload_url: false,
          media_alt_source: false,
          media_poster: false,
          resize_img_proportional: true,
          media_dimensions: false,
          media_url_resolver: (data, resolve, reject) => {
            const url = new window.URL(data.url);
            const allowedHosts =
              /^(?:\w|\d|\.)*(?:youtube\.com|vimeo\.com|youtu\.be)$/;
            const hostIsAllowed = !!url.hostname.match(allowedHosts);
            if (hostIsAllowed) {
              resolve("");
            } else {
              enqueueSnackbar(
                "You're only allowed to embed videos from YouTube or Vimeo",
                { variant: "error" }
              );
              reject(
                new Error(
                  "You're only allowed to embed videos from youtube or vimeo"
                )
              );
            }
          },
        }}
        disabled={disabled}
        onEditorChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
};

export default TinyEditor;
