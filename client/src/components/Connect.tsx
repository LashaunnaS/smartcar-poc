const Connect = ({ onClick }: any): JSX.Element => (
  <article className='connect'>
    <h2>Connect your vehicle</h2>
    <button onClick={onClick}>CONNECT</button>
  </article>
);

export default Connect;