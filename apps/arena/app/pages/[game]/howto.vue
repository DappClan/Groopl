<template>
  <div py-8>
    <div max-w-3xl>
      <h2 text-2xl font-bold mb-6>
        How to Play 8 Ball Pool
      </h2>

      <div space-y-6>
        <section>
          <h3 text-xl font-semibold mb-3 flex="~ gap-2" items-center>
            <div i-ri:target-line text-primary />
            Objective
          </h3>
          <p text-secondary leading-relaxed>
            Be the first player to pocket all of your designated balls (either solid or striped),
            and then legally pocket the 8-ball to win the game.
          </p>
        </section>

        <section>
          <h3 text-xl font-semibold mb-3 flex="~ gap-2" items-center>
            <div i-ri:gamepad-line text-primary />
            Controls
          </h3>
          <ul space-y-2 text-secondary>
            <li flex="~ gap-3">
              <div i-ri:drag-move-fill text-primary shrink-0 mt-1 />
              <span><strong>Aim:</strong> Drag your mouse or finger to aim the cue stick</span>
            </li>
            <li flex="~ gap-3">
              <div i-ri:arrow-down-line text-primary shrink-0 mt-1 />
              <span><strong>Power:</strong> Pull back to adjust shot power</span>
            </li>
            <li flex="~ gap-3">
              <div i-ri:hand-coin-line text-primary shrink-0 mt-1 />
              <span><strong>Shoot:</strong> Release to take your shot</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 text-xl font-semibold mb-3 flex="~ gap-2" items-center>
            <div i-ri:book-open-line text-primary />
            Rules
          </h3>
          <ul space-y-3 text-secondary>
            <li flex="~ gap-3">
              <div text-primary shrink-0>
                1.
              </div>
              <span>The game starts with a break shot. The first player to pocket a ball determines their group (solid or striped).</span>
            </li>
            <li flex="~ gap-3">
              <div text-primary shrink-0>
                2.
              </div>
              <span>Players take turns shooting, trying to pocket all balls in their designated group.</span>
            </li>
            <li flex="~ gap-3">
              <div text-primary shrink-0>
                3.
              </div>
              <span>If you pocket a ball legally, you get another turn.</span>
            </li>
            <li flex="~ gap-3">
              <div text-primary shrink-0>
                4.
              </div>
              <span>Once all your balls are pocketed, you must legally pocket the 8-ball to win.</span>
            </li>
            <li flex="~ gap-3">
              <div text-primary shrink-0>
                5.
              </div>
              <span><strong class="text-red">Warning:</strong> Pocketing the 8-ball before clearing your group or scratching while shooting the 8-ball results in an instant loss!</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 text-xl font-semibold mb-3 flex="~ gap-2" items-center>
            <div i-ri:lightbulb-line text-primary />
            Tips
          </h3>
          <ul space-y-2 text-secondary>
            <li flex="~ gap-3">
              <div i-ri:check-line text-green shrink-0 mt-1 />
              <span>Plan your shots ahead - think about positioning for your next shot</span>
            </li>
            <li flex="~ gap-3">
              <div i-ri:check-line text-green shrink-0 mt-1 />
              <span>Use the cushions (rails) to your advantage for difficult angles</span>
            </li>
            <li flex="~ gap-3">
              <div i-ri:check-line text-green shrink-0 mt-1 />
              <span>Control your power - not every shot needs maximum power</span>
            </li>
            <li flex="~ gap-3">
              <div i-ri:check-line text-green shrink-0 mt-1 />
              <span>Consider defensive play if you don't have a clear shot</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
