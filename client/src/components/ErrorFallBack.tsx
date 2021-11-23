interface ErrorFallBackProps {
  onClick: any;
  errorMessage: string;
}

const ErrorFallBack = ({ onClick, errorMessage }: ErrorFallBackProps): JSX.Element => (
  <article className='error'>
    <h2>Oops, looks like something went wrong!</h2>
    <p>{errorMessage}</p>
    <button onClick={onClick}>TRY AGAIN</button>
  </article>
);

export default ErrorFallBack;